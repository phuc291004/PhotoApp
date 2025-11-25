// client/src/lib/fetchModelData.js

/**
 * fetchModel - Lấy dữ liệu từ backend thật (thay vì dữ liệu giả)
 * @param {string} url - Đường dẫn mà frontend đang gọi
 * @returns {Promise} - Dữ liệu từ backend
 */
async function fetchModel(url) {
  // Địa chỉ backend của bạn (đang chạy ở port 8081)
  const backendUrl = "https://74t8mc-8081.csb.app/api";

  try {
    let apiEndpoint;

    // 1. Xử lý 3 loại URL mà frontend gọi
    if (url === "/user/list") {
      apiEndpoint = "/user/list";
    } else if (url.startsWith("/user/") && url.length > 6) {
      const userId = url.substring(6); // cắt "/user/" ra
      apiEndpoint = `/user/${userId}`;
    } else if (url.startsWith("/photosOfUser/")) {
      const userId = url.substring(14); // cắt "/photosOfUser/"
      apiEndpoint = `/photo/photosOfUser/${userId}`;
    } else {
      throw new Error("URL không được hỗ trợ: " + url);
    }

    // 2. Gọi thật đến backend
    const response = await fetch(backendUrl + apiEndpoint);

    // 3. Nếu backend trả lỗi (400, 500, v.v.)
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi từ server: ${response.status} - ${errorText}`);
    }

    // 4. Trả về dữ liệu JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu từ backend:", error);
    throw error; // để component React bắt lỗi nếu cần
  }
}

export default fetchModel;
