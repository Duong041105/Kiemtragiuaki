import { useState, useEffect } from "react";
import { Table, Input, Select, Button, Modal, Form, message } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

type Room = {
    id: string;
    name: string;
    seats: number;
    type: "Lý thuyết" | "Thực hành" | "Hội trường";
    manager: string;
};

const Danhsach = () => {
    const [search, setSearch] = useState<string>("");
    const [filter, setFilter] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const storedRooms = localStorage.getItem("rooms");
        if (storedRooms) setRooms(JSON.parse(storedRooms));
    }, []);

    useEffect(() => {
        localStorage.setItem("rooms", JSON.stringify(rooms));
    }, [rooms]);

    const filteredRooms = rooms
        .filter(room =>
            room.id.toLowerCase().includes(search.toLowerCase()) ||
            room.name.toLowerCase().includes(search.toLowerCase())
        )
        .filter(room => (filter ? room.type === filter : true))
        .sort((a, b) => sortOrder === "asc" ? a.seats - b.seats : b.seats - a.seats);

    const handleAddRoom = () => {
        form.validateFields().then(values => {
            if (rooms.some(room => room.name === values.name)) {
                message.error("Tên phòng đã tồn tại!");
                return;
            }
            setRooms([...rooms, values]);
            setIsModalOpen(false);
            form.resetFields();
        });
    };

    const handleDeleteRoom = (id: string, seats: number) => {
        if (seats >= 30) {
            message.warning("Chỉ có thể xóa phòng dưới 30 chỗ ngồi!");
            return;
        }
        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc chắn muốn xóa phòng này?",
            onOk: () => {
                setRooms(rooms.filter(room => room.id !== id));
            },
        });
    };

    const columns = [
        { title: "Mã phòng", dataIndex: "id", key: "id" },
        { title: "Tên phòng", dataIndex: "name", key: "name" },
        { title: "Số chỗ ngồi", dataIndex: "seats", key: "seats" },
        { title: "Loại phòng", dataIndex: "type", key: "type" },
        { title: "Người phụ trách", dataIndex: "manager", key: "manager" },
        {
            title: "Hành động",
            key: "actions",
            render: (_: any, record: Room) => (
                <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteRoom(record.id, record.seats)}>
                    Xóa
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <Search
                    placeholder="Tìm kiếm theo mã hoặc tên phòng..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 300 }}
                />
                <Select placeholder="Lọc theo loại phòng" style={{ width: 200 }} onChange={(value) => setFilter(value)} allowClear>
                    <Option value="Lý thuyết">Lý thuyết</Option>
                    <Option value="Thực hành">Thực hành</Option>
                    <Option value="Hội trường">Hội trường</Option>
                </Select>
                <Button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                    Sắp xếp {sortOrder === "asc" ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                </Button>
                <Button type="primary" onClick={() => setIsModalOpen(true)} icon={<PlusOutlined />}>Thêm phòng</Button>
            </div>
            <Table dataSource={filteredRooms} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} />

            <Modal title="Thêm phòng học" visible={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={handleAddRoom}>
                <Form form={form} layout="vertical">
                    <Form.Item name="id" label="Mã phòng" rules={[{ required: true, message: "Vui lòng nhập mã phòng!" }, { max: 10, message: "Tối đa 10 ký tự!" }]}> 
                        <Input />
                    </Form.Item>
                    <Form.Item name="name" label="Tên phòng" rules={[{ required: true, message: "Vui lòng nhập tên phòng!" }, { max: 50, message: "Tối đa 50 ký tự!" }]}> 
                        <Input />
                    </Form.Item>
                    <Form.Item name="seats" label="Số chỗ ngồi" rules={[{ required: true, message: "Vui lòng nhập số chỗ ngồi!" }]}> 
                        <Input type="number" min={1} />
                    </Form.Item>
                    <Form.Item name="type" label="Loại phòng" rules={[{ required: true, message: "Vui lòng chọn loại phòng!" }]}> 
                        <Select>
                            <Option value="Lý thuyết">Lý thuyết</Option>
                            <Option value="Thực hành">Thực hành</Option>
                            <Option value="Hội trường">Hội trường</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="manager" label="Người phụ trách" rules={[{ required: true, message: "Vui lòng chọn người phụ trách!" }]}> 
                        <Select>
                            <Option value="Nguyễn Văn A">Nguyễn Văn A</Option>
                            <Option value="Trần Thị B">Trần Thị B</Option>
                            <Option value="Lê Văn C">Lê Văn C</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Danhsach;
