Vue.component("el-tree-select",{
	data:function(){
		return {
			defaultCheckedKeys: [],
			isShowSelect: false, // 是否显示树状选择器
			options: [],
			selectedData: [], // 选中的节点名称
			selectedItem: [], // 选中的节点对象
			selectedValue: [], // 选中的节点对象的值
			style: 'width:' + this.width + 'px;' + 'height:' + this.height + 'px;',
			selectStyle: 'width:' + (this.width + 24) + 'px;',
			checkedIds: [],
			checkedData: []
		}
	},
	mounted:function () {
		debugger
		if (this.checkedKeys.length > 0) {
		  if (this.multiple) {
			this.defaultCheckedKeys = this.checkedKeys;
			this.selectedData = this.checkedKeys.map(function(item) {
			  var node = this.$refs.tree.getNode(item);
			  return node.label;
			});
			this.selectedItem = this.checkedKeys.map(function(item) {
			  var node = this.$refs.tree.getNode(item);
			  return node;
			});
			this.selectedValue = this.checkedKeys.map(function(item){
			  var node = this.$refs.tree.getNode(item);
			  return node.key;
			});
		  } else {
			var item = this.checkedKeys[0];
			this.$refs.tree.setCurrentKey(item);
			var node = this.$refs.tree.getNode(item);
			this.selectedData = node.label;
			this.selectedItem = node;
			this.selectedValue = node.key
		  }
		}
		var _this = this
		window.addEventListener("click", function(e){
			_this.isShowSelect = false
		})
	  },
	  watch: {
		isShowSelect:function (val) {
		  // 隐藏select自带的下拉框
		  this.$refs.select.blur();
		},
		// selectedItem:function(val){
		// 	this.$emit('input', this.selectedItem)
		// 	this.$emit('change', this.selectedItem)
		// },
		selectedValue:function(val){
			this.$emit('input', this.selectedValue)
			this.$emit('change', this.selectedValue)
		}
	  },
	  methods: {
		  clearSelect:function(){
			  this.$refs.tree.setCheckedNodes([]);
		  },
		  removeTag:function(val){
			  var nodes = []
			  this.selectedItem.forEach(function(item){
				  if(item.label != val)
					nodes.push({id:item.value,label:item.label})
			  });
			  
			  this.$refs.tree.setCheckedNodes(nodes);
		  },
		popoverHide:function () {
		  if (this.multiple) {
			this.checkedIds = this.$refs.tree.getCheckedKeys(); // 所有被选中的节点的 key 所组成的数组数据
			this.checkedData = this.$refs.tree.getCheckedNodes(); // 所有被选中的节点所组成的数组数据
		  } else {
			this.checkedIds = this.$refs.tree.getCurrentKey();
			this.checkedData = this.$refs.tree.getCurrentNode();
		  }
		  this.$emit('popoverHide', this.checkedIds, this.checkedData);
		},
		// 节点被点击时的回调,返回被点击的节点数据
		handleNodeClick :function(data, node) {
		  if (!this.multiple) {
			var tmpMap = {};
			tmpMap.value = node.key;
			tmpMap.label = node.label;
			this.options = [];
			this.options.push(tmpMap);
			this.selectedData = node.label;
			this.selectedItem = node
			this.selectedValue = node.key
			this.isShowSelect = !this.isShowSelect;
		  }
		},
		// 节点选中状态发生变化时的回调
		handleCheckChange:function () {
		  	var _this = this
			var checkedKeys = _this.$refs.tree.getCheckedKeys(); // 所有被选中的节点的 key 所组成的数组数据
			console.log(checkedKeys)
			var optionsTmp = []
		  checkedKeys.forEach(function(item){
			var node = _this.$refs.tree.getNode(item); // 所有被选中的节点对应的node
			if(!node.childNodes || node.childNodes.length == 0) {
				var tmpMap = {};
				tmpMap.value = node.key;
				tmpMap.label = node.label;
				optionsTmp.push(tmpMap)
			}
		  });
		  this.options = optionsTmp
		  this.selectedItem = this.options.map(function(item) {
			return item;
		  });
		  this.selectedData = this.options.map(function(item)  {
			return item.label;
		  });
		  this.selectedValue = this.options.map(function(item) {
			return item.value;
		  });
		}
	  },
	props: {
		// 树结构数据
		data: {
		  type: Array,
		  default : []
		},
		props:{type:Object,default:{}},
		// 配置是否可多选
		multiple: {
		  type: Boolean,
		  default: false
		},
		nodeKey: {
		  type: String,
		  default:'id'
		},
		// 显示复选框情况下，是否严格遵循父子不互相关联
		checkStrictly: {
		  type: Boolean,
		  default:false
		},
		// 默认选中的节点key数组
		checkedKeys: {
		  type: Array,
		  default () {
			return [ ];
		  }
		},
		width: {
		  type: Number,
		  default :250
		},
		height: {
		  type: Number,
		  default :300
		}
	  },
	template:'<div><div class="mask" v-show="isShowSelect" @click="isShowSelect = !isShowSelect"></div>'+
    	'<el-popover placement="bottom-start" :width="width" trigger="manual" v-model="isShowSelect" @hide="popoverHide"> '+
      	'<el-tree key="tree" class="common-tree" :style="style" ref="tree" :data="data" :props="props" :show-checkbox="multiple" '+
               ':node-key="nodeKey" :check-strictly="checkStrictly" default-expand-all :expand-on-click-node="false" :default-checked-keys="defaultCheckedKeys" '+
               ':highlight-current="true" @node-click="handleNodeClick" @check-change="handleCheckChange"></el-tree>'+
      '<el-select  style="width: 100%;" slot="reference" ref="select" @remove-tag="removeTag" @clear="clearSelect" '+
                 'v-model="selectedData" clearable :multiple="multiple" @click.native="isShowSelect = !isShowSelect" >'+
        '<el-option v-for="item in options" id="item.value" :key="item.value" :label="item.label" :value="item.value"></el-option>'+
      '</el-select></el-popover></div>'
})
