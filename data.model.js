const { dynamodb } = require("./aws.helper");
const tableName = "Subject";

const SubjectModel = {
  // Tạo một subject mới với các thuộc tính: stt, tenMonHoc, loai, hocKy, và khoa.
  createSubject: async (subjectData) => {
    /**
     * subjectData cần có cấu trúc:
     * {
     *   stt: Number,        // Ví dụ: 1
     *   tenMonHoc: String,  // Ví dụ: "Cơ sở dữ liệu"
     *   loai: String,       // Ví dụ: "Cơ sở"
     *   hocKy: String,      // Ví dụ: "HK1-2020-2021"
     *   khoa: String        // Ví dụ: "K.CNTT"
     * }
     */
    const params = {
      TableName: tableName,
      Item: {
        id: subjectData.stt,
        stt: subjectData.stt,
        tenMonHoc: subjectData.tenMonHoc,
        loai: subjectData.loai,
        hocKy: subjectData.hocKy,
        khoa: subjectData.khoa,
      },
    };

    try {
      await dynamodb.put(params).promise();
      return params.Item;
    } catch (error) {
      console.error("Error creating subject:", error);
      throw error;
    }
  },

  // Lấy tất cả các subject từ table.
  getSubjects: async () => {
    const params = {
      TableName: tableName,
    };
    try {
      const subjects = await dynamodb.scan(params).promise();
      return subjects.Items;
    } catch (error) {
      console.error("Error getting subjects:", error);
      throw error;
    }
  },

  // Cập nhật subject dựa trên stt.
  // subjectData cần chứa các giá trị mới cho: tenMonHoc, loai, hocKy, và khoa.
  // Lưu ý: stt là khóa chính không được thay đổi.
  updateSubject: async (stt, subjectData) => {
    const params = {
      TableName: tableName,
      Key: {
        id: stt,
      },
      UpdateExpression:
        "set tenMonHoc = :tenMonHoc, loai = :loai, hocKy = :hocKy, khoa = :khoa",
      ExpressionAttributeValues: {
        ":tenMonHoc": subjectData.tenMonHoc,
        ":loai": subjectData.loai,
        ":hocKy": subjectData.hocKy,
        ":khoa": subjectData.khoa,
      },
      ReturnValues: "ALL_NEW",
    };

    try {
      const updatedSubject = await dynamodb.update(params).promise();
      return updatedSubject.Attributes;
    } catch (error) {
      console.error("Error updating subject:", error);
      throw error;
    }
  },

  // Xóa subject dựa trên stt.
  deleteSubject: async (stt, tenMonHoc) => {
    /**
     * Bước 1: Tạo một object params chứa thông tin của subject cần xoá
     * Bước 2: Thực hiện xoá subject bằng method delete
     * Bước 3: Trả về thông tin của subject đã xoá
     * Bước 4: Xử lý lỗi nếu có
     */
    const params = {
      TableName: tableName,
      Key: {
        id: stt, // id là partition key
        tenMonHoc: tenMonHoc, // bởi vì chúng ta có thêm sort key nên cần thêm name vào key
      },
    };
    try {
      await dynamodb.delete(params).promise();
      return { id: stt };
    } catch (error) {
      console.error("Error deleting subject:", error);
      throw error;
    }
  },

  // Lấy thông tin của 1 subject dựa trên id.
  getOneSubject: async (stt) => {
    /**
     * Bước 1: Tạo một object params chứa thông tin của subject cần lấy
     * Bước 2: Thực hiện lấy thông tin của subject bằng method query
     * Bước 3: Trả về thông tin của subject đã lấy
     * Bước 4: Xử lý lỗi nếu có
     */
    const params = {
      TableName: tableName,
      KeyConditionExpression: "id = :id", // Điều kiện để lấy subject dựa trên subjectId
      // Giá trị của điều kiện trên
      ExpressionAttributeValues: {
        ":id": stt,
      },
    };

    try {
      const data = await dynamodb.query(params).promise();
      return data.Items[0];
    } catch (error) {
      console.error("Error getting one subject:", error);
      throw error;
    }
  },
};

module.exports = SubjectModel;
