import { Button, Drawer, Form, Input, Popconfirm } from "antd";

const AddStudentDrawer = ({ open, onClose, onCreate }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onCreate(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Drawer
      title="Thêm mới sinh viên"
      width={400}
      onClose={onClose}
      open={open}
      footer={
        <div
          style={{
            textAlign: "right",
          }}
        >
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Popconfirm
            title="Bạn chắc chắn chưa ?"
            description="Bạn có muốn thêm học sinh này ?"
            okText="Có"
            cancelText="Không"
          >
            <Button onClick={handleOk} type="primary">
              Thêm
            </Button>
          </Popconfirm>
        </div>
      }
    >
      <Form form={form} layout="vertical" hideRequiredMark>
        <Form.Item
          name="name"
          label="Họ tên"
          rules={[
            { required: true, message: "Vui lòng nhập họ tên sinh viên" },
          ]}
        >
          <Input placeholder="Nhập họ tên" />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số điện thoại",
            },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ type: "email", message: "Email không hợp lệ" }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>
        {/* Các trường khác bạn muốn thêm mới */}
      </Form>
    </Drawer>
  );
};

export default AddStudentDrawer;
