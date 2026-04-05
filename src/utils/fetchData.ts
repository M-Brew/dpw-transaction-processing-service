async function fetchData(url: string, init?: RequestInit) {
  try {
    const response = await fetch(url, init);
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return { status: response.status, data };
    } else {
      return { status: response.status };
    }

  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export { fetchData }