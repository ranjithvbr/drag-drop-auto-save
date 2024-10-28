import { http, HttpResponse } from "msw";

// Initialize data in localStorage if not already set
const initialData = JSON.parse(localStorage.getItem("documentList")) || [
  { id: 1, type: "bankdraft", title: "Bank Draft", position: 0 },
  { id: 2, type: "bill-of-lading", title: "Bill of Lading", position: 1 },
  { id: 3, type: "invoice", title: "Invoice", position: 2 },
  { id: 4, type: "bank-draft-2", title: "Bank Draft 2", position: 3 },
  { id: 5, type: "bill-of-lading-2", title: "Bill of Lading 2", position: 4 },
];

if (!localStorage.getItem("documentList")) {
  localStorage.setItem("documentList", JSON.stringify(initialData));
}

export const handlers = [
  // GET handler for retrieving the document list
  http.get("/api/getorderlist", () => {
    const documentList = JSON.parse(localStorage.getItem("documentList"));
    return HttpResponse.json({ orders: documentList });
  }),

  // POST handler for saving/updating the document list
  http.post("/api/saveorderlist", async ({ request }) => {
    const requestBody = await request.json();
    localStorage.setItem("documentList", JSON.stringify(requestBody.documentList));
    return HttpResponse.json({
      message: "Order list saved successfully",
      documentList: requestBody.documentList,
    });
  }),
];
