**I have focused on frontend development; please review only the frontend code.**

Clone the Repository

`git clone https://github.com/yourusername/drag-drop-auto-save.git`

`cd drag-drop-auto-save`

Install Package Dependencies

`npm install`

To register the service worker

`npx msw init ./public/`

To run the Application

`npm start`


**Alternatively, you can build and run the application using Docker:**

`docker build -t drag-drop-auto-save .`

`docker run -p 3000:3000 drag-drop-auto-save`


## **Architectural / API Design Approach**

**Random Cat Images**: Each time the app reloads, it displays different cat images to make it easy to see the loading spinner in action.

**Components**: Each card is a separate component with drag-and-drop functionality. The main app container manages the card order and auto-save.

**Auto-Save**: The app saves the card order every 5 seconds if there are any changes. It interacts with two mock API endpoints: one to load the card list and another to save updates.

**Mock API with MSW**: During development, MSW (Mock Service Worker) is used to simulate backend responses, so we can test frontend functionality without needing an actual server.

**Efficiency and User Experience**: Only saves data when changes happen, reducing unnecessary requests. A “Saving…” spinner and last-saved time keep users informed. MSW enables easy testing of API interactions, making the app easy to develop and deploy.
