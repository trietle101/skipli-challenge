import { Menu } from "antd";
import {
  UsergroupAddOutlined,
  CarryOutOutlined,
  MessageOutlined
} from "@ant-design/icons";

const items = [
  {
    key: "1",
    icon: <UsergroupAddOutlined />,
    label: "Manage Employees"
  },
  {
    key: "2",
    icon: <CarryOutOutlined />,
    label: "Manage Tasks"
  },
  {
    key: "3",
    icon: <MessageOutlined />,
    label: "Messages"
  }
];
const items2 = [
  {
    key: "2",
    icon: <CarryOutOutlined />,
    label: "Manage Tasks"
  },
  {
    key: "3",
    icon: <MessageOutlined />,
    label: "Messages"
  }
];
function Nav(props) {
  // const [tabKey, setTabKey] = useState("1");
  const currentUser = JSON.parse(localStorage.getItem("userCreadentials")).user
    .userData;
  return (
    <div className="nav">
      <div className="nav--container">
        {currentUser.role === "admin" ? (
          <Menu
            defaultSelectedKeys={["1"]}
            mode="inline"
            theme="dark"
            items={items}
            onClick={({ key }) => {
              props.sendData(key);
            }}
          />
        ) : (
          <Menu
            defaultSelectedKeys={["3"]}
            mode="inline"
            theme="dark"
            items={items2}
            onClick={({ key }) => {
              props.sendData(key);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Nav;
