// utils/isAuthorized.ts
const isAuthorised = async () => {
    try {
      const res = await fetch("/api/user/token", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
  
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem("user", JSON.stringify(data.verify));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  };
  
  export default isAuthorised;
  