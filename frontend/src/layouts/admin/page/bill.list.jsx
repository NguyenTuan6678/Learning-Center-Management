import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Typography,
  message,
  Input,
  Space,
  Modal,
  Form,
  InputNumber,
} from "antd";
import { DeleteFilled, EditFilled, SearchOutlined } from "@ant-design/icons";
import Chip from "@mui/material/Chip";
import { getall } from "../../../services/bill.service";
import {
  get as getBillDetail,
  update as updateBillDetail,
} from "../../../services/billdetail.service";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { getall as getAllParents } from "../../../services/parent.service";
import { getall as getAllStudents } from "../../../services/student.service";
import moment from "moment";
import { debounce } from "lodash";

const ManageBills = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billDetailData, setBillDetailData] = useState(null);
  const [form] = Form.useForm();
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(
    form.getFieldValue("studentId") || ""
  );
  const [selectedParentId, setSelectedParentId] = useState(
    form.getFieldValue("parentId") || ""
  );
  const [selectedBillStatus, setSelectedBillStatus] = useState(
    form.getFieldValue("paymentStatus") || ""
  );

  const handleStudentChange = (event) => {
    const value = event.target.value;
    // console.log("***Selected Student ID:", value);
    setSelectedStudentId(value);
    form.setFieldsValue({ studentId: value });
  };

  const handleParentChange = (event) => {
    const value = event.target.value;
    // console.log("***Selected Parent ID:", value);
    setSelectedParentId(value);
    form.setFieldsValue({ parentId: value });
  };

  const handleBillStatusChange = (event) => {
    const value = event.target.value;
    console.log("***Selected Bill Status:", value);
    setSelectedBillStatus(value);
    form.setFieldsValue({ billStatus: value });
  };

  //   console.log("***seletedRowData: ", selectedRowData);
  //   console.log("***billDetailData: ", billDetailData);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await getall();
      console.log("**res", res);
      const bills = res?.data?.rows || [];
      setDataSource(
        bills.map((item, index) => ({
          key: item.billId || `bill-${index}`,
          ...item,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch bills:", error);
      message.error("Lỗi khi tải danh sách hóa đơn!");
    } finally {
      setLoading(false);
    }
  };

  const fetchBillDetail = async (billId) => {
    setLoading(true);
    try {
      const res = await getBillDetail(billId);
      console.log("**res bill detail", res);
      setBillDetailData(res?.data);
      form.setFieldsValue({
        billId: res?.data?.billId,
        description: res?.data?.description,
        amount: res?.data?.amount,
        currency: res?.data?.currency,
        studentId: res?.data?.studentId || "",
        parentId: res?.data?.parentId || "",
        paymentStatus: res?.data?.paymentStatus || "",
      });
      setSelectedBillStatus(res?.data?.paymentStatus || "");
    } catch (error) {
      console.error("Failed to fetch bill detail:", error);
      message.error("Lỗi khi tải chi tiết hóa đơn!");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await getAllStudents();
      // console.log("**res students", res);
      setStudents(res?.data?.rows || []); // Assuming the API returns an array of StudentDTO
    } catch (error) {
      console.error("Failed to fetch students:", error);
      message.error("Lỗi khi tải danh sách học sinh!");
    }
  };

  const fetchParents = async () => {
    try {
      const res = await getAllParents();
      // console.log("**res parents", res);
      setParents(res?.data?.rows || []); // Assuming the API returns an array of ParentDTO
    } catch (error) {
      console.error("Failed to fetch parents:", error);
      message.error("Lỗi khi tải danh sách phụ huynh!");
    }
  };

  const handleEditClick = (record) => {
    setSelectedRowData(record);
    setIsModalOpen(true);
    fetchBillDetail(record.id);
  };

  const handleUpdateBillDetail = async (values) => {
    setLoading(true);
    console.log("***Form Values on Submit:", values);
    try {
      await updateBillDetail({
        id: billDetailData?.billId,
        description: values.description,
        amount: values.amount,
        currency: values.currency,
        studentId: values.studentId,
        parentId: values.parentId,
        paymentStatus: values.paymentStatus,
      });
      console.log("***Values ", values);
      message.success("Cập nhật hóa đơn thành công!");
      setIsModalOpen(false);
      setBillDetailData(null);
      fetchBills();
    } catch (error) {
      console.error("Failed to update bill detail:", error);
      message.error("Lỗi khi cập nhật hóa đơn!");
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setBillDetailData(null);
    form.resetFields();
  };

  const billStatusOptions = ["PENDING_PAYMENT", "PAID", "CANCELLED"];

  const columns = [
    { title: "Id", dataIndex: "id", key: "id", fixed: "left" },
    { title: "Nội dung", dataIndex: "content", key: "content" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        let label = "";

        switch (status) {
          case "PENDING_PAYMENT":
            color = "warning";
            label = "Chờ thanh toán";
            break;
          case "PAID":
            color = "success";
            label = "Đã thanh toán";
            break;
          case "CANCELLED":
            color = "error";
            label = "Đã huỷ";
            break;
          default:
            label = status;
        }

        return <Chip label={label} color={color} variant="outlined" />;
      },
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (text ? moment(text).format("HH:mm DD-MM-YY") : ""),
    },
    {
      title: "Thời gian cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => (text ? moment(text).format("HH:mm DD-MM-YY") : ""),
    },
    {
      title: "Hành đông",
      key: "action",
      fixed: "right",
      width: 110,
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <Typography.Link onClick={() => handleDelete(record.id)}>
            <DeleteFilled style={{ fontSize: "18px", color: "red" }} />
          </Typography.Link>
          <Typography.Link>
            <EditFilled style={{ fontSize: "18px", color: "#1890ff" }} />
          </Typography.Link>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchBills();
    fetchStudents();
    fetchParents();
  }, []);

  useEffect(() => {
    if (billDetailData) {
      console.log("***billDetailData changed:", billDetailData);
      setSelectedStudentId(billDetailData.studentId || "");
      setSelectedParentId(billDetailData.parentId || "");
      setSelectedBillStatus(billDetailData.paymentStatus || "");
      console.log("***selectedBillStatus:", selectedBillStatus);
    }
  }, [billDetailData]);

  // console.log("***dataSource before Table:", dataSource);
  // console.log("***Students data before map:", students);
  // console.log("***Bills data before map:", billDetailData);
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px",
        }}
      >
        <Space.Compact>
          <Input
            style={{ width: "70%" }}
            placeholder="Tìm kiếm"
            prefix={<SearchOutlined />}
            value={searchText}
            // onChange={handleSearchInputChange}
          />
        </Space.Compact>
        <Button
          type="primary"
          icon={<SearchOutlined />}
          style={{ marginBottom: "8px" }}
        >
          Thêm hoá đơn
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 1500 }}
        sticky={{ offsetHeader: 64 }}
        pagination={true}
        loading={loading}
        onRow={(record) => {
          return {
            onClick: () => {
              handleEditClick(record);
            },
          };
        }}
      />
      <Modal
        title="Chi tiết hóa đơn"
        open={isModalOpen}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => form.submit()}
          >
            Lưu
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateBillDetail}>
          <Form.Item name="billId" label="Id">
            <Input disabled value={billDetailData?.billId} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Nội dung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Số tiền"
            rules={[{ required: true, message: "Vui lòng nhập số tiền!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="currency"
            label="Đơn vị tiền tệ"
            rules={[
              { required: true, message: "Vui lòng chọn đơn vị tiền tệ!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="paymentStatus" label="Trạng thái hóa đơn">
            <FormControl fullWidth>
              <InputLabel id="payment-select-label">Trạng thái</InputLabel>
              <Select
                labelId="paymentStatus-select-label"
                id="paymentStatus-select"
                label="Trạng thái"
                value={selectedBillStatus}
                onChange={handleBillStatusChange}
                style={{ width: "100%" }}
              >
                {billStatusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status === "PENDING_PAYMENT"
                      ? "Chờ thanh toán"
                      : status === "PAID"
                      ? "Đã thanh toán"
                      : status === "CANCELLED"
                      ? "Đã huỷ"
                      : status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Form.Item>

          <Form.Item
            name="studentId"
            label="Học sinh"
            rules={[{ required: true, message: "Vui lòng chọn học sinh!" }]}
          >
            <FormControl fullWidth>
              <InputLabel id="student-select-label">Học sinh</InputLabel>
              <Select
                labelId="student-select-label"
                id="student-select"
                label="Học sinh"
                value={selectedStudentId}
                onChange={handleStudentChange}
              >
                <MenuItem value="" disabled>
                  <em>Chọn học sinh</em>
                </MenuItem>
                {students.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Form.Item>

          <Form.Item
            name="parentId"
            label="Phụ huynh"
            rules={[{ required: true, message: "Vui lòng chọn phụ huynh!" }]}
          >
            <FormControl fullWidth>
              <InputLabel id="parent-select-label">Phụ huynh</InputLabel>
              <Select
                labelId="parent-select-label"
                id="parent-select"
                label="Phụ huynh"
                value={selectedParentId}
                onChange={handleParentChange}
              >
                <MenuItem value="" disabled="true">
                  <em>Chọn phụ huynh</em>
                </MenuItem>
                {parents.map((parent) => (
                  <MenuItem key={parent.id} value={parent.id}>
                    {parent.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageBills;
