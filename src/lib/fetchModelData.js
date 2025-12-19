async function fetchModelData(url) {
  const res = await fetch(`https://74t8mc-8081.csb.app/api${url}`, {
    credentials: "include",
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Fail: ${res.status} - ${txt}`);
  }
  return await res.json();
}

export default fetchModelData;
