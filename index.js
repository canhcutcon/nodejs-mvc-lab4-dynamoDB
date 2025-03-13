const express = require("express");
const app = express();
const PORT = 3000; // lấy giá trị PORT  mặc định là 3000
const bodyParser = require("body-parser");

app.use(express.json({ extended: false })); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
// Render giao diện
app.use(bodyParser.json()); // parse application/json
app.use(express.static("./views")); // render giao diện từ thư mục views
app.set("view engine", "ejs"); // sử dụng ejs làm view engine cho express
app.set("views", "./views"); // thư mục chứa các file ejs

const SubjectModel = require("./data.model");

// Router cho ứng dụng
app.get("/", async (req, res) => {
  try {
    const data = await SubjectModel.getSubjects();
    res.render("index", { data });
  } catch (error) {
    console.error("Error retrieving subjects:", error);
    res.status(500).send("Error retrieving subjects");
  }
});

let data = [
  {
    stt: 6,
    tenMonHoc: "Cơ sở dữ liệu",
    loai: "Cơ sở",
    hocKy: "HK1-2020-2021",
    khoa: "K.CNTT",
  },
  {
    stt: 7,
    tenMonHoc: "Cấu trúc dữ liệu",
    loai: "Cơ sở",
    hocKy: "HK1-2020-2021",
    khoa: "K.CNTT",
  },
  {
    stt: 8,
    tenMonHoc: "Công nghệ phần mềm",
    loai: "Cơ sở ngành",
    hocKy: "HK1-2020-2021",
    khoa: "K.CNTT",
  },
  {
    stt: 9,
    tenMonHoc: "Công nghệ mới",
    loai: "Chuyên ngành",
    hocKy: "HK1-2020-2021",
    khoa: "K.CNTT",
  },
  {
    stt: 10,
    tenMonHoc: "Đồ án môn học",
    loai: "Chuyên ngành",
    hocKy: "HK1-2020-2021",
    khoa: "K.CNTT",
  },
];
// Tạo subject mới thông qua model
app.post("/save", async (req, res) => {
  try {
    // Lấy dữ liệu từ form và ánh xạ sang cấu trúc dữ liệu của model
    // const newCourse = {
    //   stt: Number(req.body.id), // Nếu form gửi field "id", tương ứng với stt
    //   tenMonHoc: req.body.name,
    //   loai: req.body.course_type,
    //   hocKy: req.body.semester,
    //   khoa: req.body.department,
    // };
    for (const i of data) {
      const newCourse = {
        stt: Number(i.stt), // Nếu form gửi field "id", tương ứng với stt
        tenMonHoc: i.tenMonHoc,
        loai: i.loai,
        hocKy: i.hocKy,
        khoa: i.khoa,
      };
      await SubjectModel.createSubject(newCourse);
    }
    res.redirect("/");
  } catch (error) {
    console.error("Error saving subject:", error);
    res.status(500).send("Error saving subject");
  }
});

// Xoá subject dựa trên stt. Vì model xoá yêu cầu cả stt và tenMonHoc nên ta cần lấy subject trước.
app.post("/delete/:id", async (req, res) => {
  try {
    const stt = Number(req.params.id);
    // Lấy subject dựa trên stt (giả sử stt là duy nhất)
    const subject = await SubjectModel.getOneSubject(stt);
    if (subject) {
      await SubjectModel.deleteSubject(
        subject.stt ?? subject.id,
        subject.tenMonHoc
      );
    }
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).send("Error deleting subject");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
