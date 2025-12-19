// lib/api.ts - Dummy data (Mock)

// Comment out or remove API_BASE, fetchWithAuth, etc., if backend is available.

// ORG Dummy
export function getOrgs() {
  return [
    { id: "org1", name: "Org One", email: "org1@example.com" },
    { id: "org2", name: "Org Two", email: "org2@example.com" },
  ];
}
export function addOrg(name: string, email: string) {
  return { id: Math.random().toString(36).slice(2), name, email };
}

// PRODUCT Dummy
export function getProducts(org_id: string) {
  return [
    { id: "prod1", name: "Product Alpha", description: "First Product" },
    { id: "prod2", name: "Product Beta", description: "Second Product" },
  ];
}
export function addProduct(org_id: string, name: string, description: string) {
  return { id: Math.random().toString(36).slice(2), name, description };
}

// FEEDBACK Dummy
export function getFeedbacks(org_id: string, product_id: string) {
  return [
    { id: "fb1", title: "Dark Mode", description: "Support dark mode", status: "open" },
    { id: "fb2", title: "Speed", description: "Faster load times", status: "done" },
  ];
}
export function addFeedback(org_id: string, product_id: string, title: string, description: string) {
  return { id: Math.random().toString(36).slice(2), title, description, status: "open" };
}

// COMMENTS Dummy
export function getComments() {
  return [
    { id: "c1", content: "This would be great!" },
    { id: "c2", content: "Agreed!" },
  ];
}
export function addComment(content: string) {
  return { id: Math.random().toString(36).slice(2), content };
}
