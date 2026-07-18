export function getAnonId() {
    let anonId = localStorage.getItem("soa_anon_id");
  
    if (!anonId) {
      anonId = crypto.randomUUID();
      localStorage.setItem("soa_anon_id", anonId);
    }
  
    return anonId;
  }