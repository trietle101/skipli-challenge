import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import { Button, Space, Table, Tag, Modal, Form, Input } from "antd";
import { Toaster, toast } from "sonner";

function Employee(props) {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number"
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "role",
      render: (_, { role }) => (
        <>
          <Tag color={role === "admin" ? "green" : "blue"} key={role}>
            {role.toUpperCase()}
          </Tag>
        </>
      )
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => showModal("edit", record)} type="primary">
            <EditOutlined />
          </Button>
          <Button type="primary" danger onClick={() => deleteUser(record.id)}>
            <DeleteOutlined />
          </Button>
        </Space>
      )
    }
  ];
  const [employeeData, setEmployeeData] = useState([]);
  const [isModalNewOpen, setIsModalNewOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form] = Form.useForm();

  const editEmployee = async (id, values) => {
    const fetchedEmployee = [];
    const token = JSON.parse(localStorage.getItem("userCreadentials")).token;

    try {
      await axios
        .put(`http://localhost:3001/api/users/edit/${id}`, values, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })
        .then((response) =>
          response.data.map((data) => fetchedEmployee.push(data))
        );
      setEmployeeData(fetchedEmployee);
      closeModal("edit");
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.error);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        // toast.error("Error:", error.message);
        toast.error(error.message);
      }
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete?") === true) {
      const token = JSON.parse(localStorage.getItem("userCreadentials")).token;
      const fetchedEmployee = [];
      try {
        await axios
          .delete(`http://localhost:3001/api/users/delete/${id}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          })
          .then((response) =>
            response.data.map((data) => fetchedEmployee.push(data))
          );
        setEmployeeData(fetchedEmployee);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.error);
        } else if (error.request) {
          toast.error(error.request);
        } else {
          toast.error(error.message);
        }
      }
    }
  };

  useEffect(() => {
    setEmployeeData(props.employeeData);
  }, [props.employeeData]);

  const afterOpenChange = (visible) => {
    if (visible && editData) {
      form.setFieldsValue(editData);
    }
  };

  //Handle open/close modals
  const showModal = (type, rec) => {
    if (type === "new") setIsModalNewOpen(true);
    if (type === "edit") {
      setEditData(rec);

      // form.setFieldsValue(editData);
      setIsModalEditOpen(true);
    }
  };

  const closeModal = (type) => {
    if (type === "new") setIsModalNewOpen(false);
    else if (type === "edit") setIsModalEditOpen(false);
  };

  const handleCancel = (type) => {
    if (type === "new") setIsModalNewOpen(false);
    else if (type === "edit") {
      setIsModalEditOpen(false);
    }
  };

  // Handle create employee
  const onNewFinish = async (values) => {
    const fetchedEmployee = [];
    const token = JSON.parse(localStorage.getItem("userCreadentials")).token;
    try {
      await axios
        .post("http://localhost:3001/api/users/add", values, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })
        .then(function (response) {
          response.data.map((data) => fetchedEmployee.push(data));
        });
      toast.success("New user added!");
      closeModal("new");
      setEmployeeData(fetchedEmployee);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else if (error.request) {
        toast.error(error.request);
      } else {
        toast.error(error.message);
      }
    }
  };
  const onNewFinishFailed = (errorInfo) => {
    toast.error("Create Failed:", errorInfo);
  };

  // Handle edit employee
  const onEditFinish = (values) => {
    toast.success("Edit Success:", values);
    if (localStorage.getItem("userCreadentials")) {
      editEmployee(values.id, values);
    }
  };
  const onEditFinishFailed = (errorInfo) => {
    toast.error("Edit Failed:", errorInfo);
  };
  return (
    <div className="employee">
      <div className="employee--container">
        <h1>Employee</h1>
        <div className="header">
          <h2>10 Employees</h2>
          <div className="actions">
            <Button
              name="new"
              onClick={() => showModal("new")}
              type="primary"
              icon={<PlusCircleOutlined />}
            >
              Create new employee
            </Button>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={employeeData}
          pagination={false}
          rowHoverable={false}
          rowKey="id"
          scroll={{
            y: 470
          }}
        />
        {/* Create form modal */}
        <Modal
          title="New Modal"
          open={isModalNewOpen}
          onOk={() => {
            // closeModal("new");
            form.submit();
          }}
          onCancel={() => handleCancel("new")}
          destroyOnClose
        >
          <Form
            name="new"
            form={form}
            clearOnDestroy
            labelCol={{
              span: 8
            }}
            wrapperCol={{
              span: 16
            }}
            style={{
              maxWidth: 600
            }}
            initialValues={{
              remember: true
            }}
            onFinish={(values) => onNewFinish(values)}
            onFinishFailed={onNewFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!"
                }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!"
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phone_number"
              rules={[
                {
                  required: true,
                  message: "Please input your phone number correctly!"
                }
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
        {/* Edit form modal */}
        <Modal
          title="Edit Modal"
          open={isModalEditOpen}
          onOk={() => {
            form.submit();
          }}
          onCancel={() => handleCancel("edit")}
          afterOpenChange={afterOpenChange}
        >
          <Form
            name="basic"
            form={form}
            clearOnDestroy
            labelCol={{
              span: 8
            }}
            wrapperCol={{
              span: 16
            }}
            style={{
              maxWidth: 600
            }}
            // initialValues={editData}
            onFinish={(values) => onEditFinish(values)}
            onFinishFailed={onEditFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="ID"
              name="id"
              rules={[
                {
                  required: true,
                  message: "Please input your name!"
                }
              ]}
              hidden
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!"
                }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!"
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phone_number"
              rules={[
                {
                  required: true,
                  message: "Please input your phone number correctly!"
                }
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
        <Toaster position="top-right" />
      </div>
    </div>
  );
}

export default Employee;
