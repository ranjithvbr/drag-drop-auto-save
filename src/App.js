import React, { useEffect, useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";

const ItemType = "CARD";

const thumbnails = {
  "bankdraft": "https://cataas.com/cat/says/Bankdraft",
  "bill-of-lading": "https://cataas.com/cat/says/Bill%20of%20Lading",
  "invoice": "https://cataas.com/cat/says/Invoice",
  "bank-draft-2": "https://cataas.com/cat/says/Bank%20Draft%202",
  "bill-of-lading-2": "https://cataas.com/cat/says/Bill%20of%20Lading%202",
};

// Card component
const Card = ({ data, index, moveCard, openOverlay }) => {
  const [loading, setLoading] = useState(true);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: data.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveCard(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} onClick={() => openOverlay(data.thumbnail)}>
      <p>{data.title}</p>
      <div className="img-container">
        {loading && <div className="spinner" />}
        <img
          src={data.thumbnail}
          alt={data.content}
          onLoad={() => setLoading(false)}
          style={{
            opacity: isDragging ? 0.5 : 1,
            display: loading ? "none" : "block",
          }}
          className="card-img"
        />
      </div>
    </div>
  );
};

// Main component
const HorizontalScrollableDnD = () => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overlayImage, setOverlayImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Open image overlay
  const openOverlay = (image) => {
    setOverlayImage(image);
  };

  // Close overlay on ESC key press
  const closeOverlay = useCallback((e) => {
    if (e.key === "Escape") {
      setOverlayImage(null);
    }
  }, []);

  useEffect(() => {
    if (overlayImage) {
      window.addEventListener("keydown", closeOverlay);
    } else {
      window.removeEventListener("keydown", closeOverlay);
    }
    return () => window.removeEventListener("keydown", closeOverlay);
  }, [overlayImage, closeOverlay]);

  // Load initial data from /api/getorderlist
  useEffect(() => {
    fetch("/api/getorderlist")
      .then((res) => res.json())
      .then((data) => {
        const initializedCards = data.orders.map((doc, idx) => ({
          ...doc,
          content: `Card ${idx + 1}`,
          thumbnail: thumbnails[doc.type] || thumbnails.bankdraft,
        }));
        setCards(initializedCards);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching order list:", error));
  }, []);

  // Track changes to the card order
  const moveCard = (fromIndex, toIndex) => {
    const updatedCards = [...cards];
    const [movedCard] = updatedCards.splice(fromIndex, 1);
    updatedCards.splice(toIndex, 0, movedCard);
    setCards(updatedCards);
    setHasChanges(true);
  };

  // Save data to the API every 5 seconds, but only if there are changes
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (hasChanges) {
        setIsSaving(true);
        fetch("/api/saveorderlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentList: cards }),
        })
          .then((res) => res.json())
          .then(() => {
            setIsSaving(false);
            setLastSaved(new Date());
            setHasChanges(false); // Reset changes tracker after saving
          })
          .catch((error) => {
            setIsSaving(false);
            console.error("Error saving order list:", error);
          });
      }
    }, 5000);

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [cards, hasChanges]);

  if (isLoading) {
    return <div>Loading cards...</div>;
  }

  return (
    <div className="app-container">
      {overlayImage && (
        <div className="overlay" onClick={() => setOverlayImage(null)}>
          <img src={overlayImage} alt="Overlay" className="overlay-image" />
        </div>
      )}
      <DndProvider backend={HTML5Backend}>
        <div className="drag-drop-container">
          <div className="card-container">
            {cards.slice(0, 3).map((card, index) => (
              <Card
                key={card.id}
                index={index}
                data={card}
                moveCard={moveCard}
                openOverlay={openOverlay}
              />
            ))}
          </div>
          <div className="card-container-with-margin">
            {cards.slice(3).map((card, index) => (
              <Card
                key={card.id}
                index={index + 3}
                data={card}
                moveCard={moveCard}
                openOverlay={openOverlay}
              />
            ))}
          </div>
        </div>
      </DndProvider>
      <div className="last-saved">
        {isSaving ? (
          <div>Saving...</div>
        ) : (
          lastSaved && <div>Last saved: {lastSaved.toLocaleTimeString()}</div>
        )}
      </div>
    </div>
  );
};

export default HorizontalScrollableDnD;
