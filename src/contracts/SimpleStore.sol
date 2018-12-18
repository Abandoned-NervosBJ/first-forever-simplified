pragma solidity ^0.4.24;  // 版本要高于0.4.24才可以编译

contract SimpleStore {
    mapping (address => mapping (uint256 => string)) private records;
    /*
        mapping类型 理解为字典
        0x81acb7ffda65c125646ac9b8d98cf47c170c01a9 => {1231006505 => "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"}
     */

    mapping (address => uint256[]) private categories;
    /*
        0x81acb7ffda65c125646ac9b8d98cf47c170c01a9 => 235833
        0x398ca5cf715201c8c3ebf301ce8f0ed577a3f258 => 623735
    */

    event Recorded(address _sender, string indexed _text, uint256 indexed _time); // 定义事件

    function _addToList(address from, uint256 time) private { // 私有方法
        categories[from].push(time); // mapping 添加一个元素
    }

    function getList()
    public // public是公共方法
    view // view 表示这个查询方法,不改变数据的状态
    returns (uint256[])// 返回的数据类型
    {
        return categories[msg.sender];
    }

    function add(string text, uint256 time) public { // 公共方法, 外部可以调用
        records[msg.sender][time]=text; // 赋值
        _addToList(msg.sender, time); // 调用方法
        emit Recorded(msg.sender, text, time); // 触发事件
    }

    function get(uint256 time) public view returns(string) { // 公共方法, 外部可以调用
        return records[msg.sender][time];
    }
}
