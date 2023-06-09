class AbstractTreeEntry {
  constructor(data) {
    this.keyExpr = data.keyExpr;
    this.parentExpr = data.parentExpr;
    this.allowChildren = data.allowChildren;
    this.items = data.items;
  }
  get options() {
    return {
      keyExpr: this.keyExpr,
      parentExpr: this.parentExpr,
      allowChildren: this.allowChildren
    }
  }
}

class AbstractGenericTree {
  get root() {
    const rootEntry = this.data[this.rootLevel];
    return {
      isRoot: true,
      data: rootEntry.items[this.rootIndex],
      options: rootEntry.options
    }
  }
  
  constructor(data = [], rootLevel = 0, rootIndex = 0) {
    this.data = data.map(function(entryData) {
      // todo: check for unique keys (?)
      return new AbstractTreeEntry(entryData);
    })
    this.rootLevel = rootLevel;
    this.rootIndex = rootIndex;
  }

  *traverseEntries() {
    for (let i = 0; i < this.data.length; i++) {
      for (let k = 0, l = this.data[i].items.length; k < l; k++) {
        yield {
          isRoot: i === this.rootLevel && k === this.rootIndex,
          data: this.data[i].items[k],
          options: this.data[i].options
        };
      }
    }
  }
}

class TreeNode {
  get key() {
    return this.data[this.keyExpr];
  }
  get parentKey() {
    return this.data[this.parentExpr];
  }
  get data() {
    let res = {};
    try {
      res = JSON.parse(JSON.stringify(this._data));
    } catch(err) {
      // todo: error handling
      console.warn('Corrupted node value.', this._data);
    }
    return res;
  }
  set data(value) {
    try {
      this._data = JSON.parse(JSON.stringify(value));
    } catch(err) {
      // todo: error handling
      console.warn('Trying to attach data with wrong format.', value);
    }
  }
  constructor(data, options) {
    this._data = data;
    this.keyExpr = options.keyExpr;
    this.parentExpr = options.parentExpr;
    this.allowChildren = options.allowChildren;
    this.parentNode = null;
    this.firstChild = null;
    this.nextSibling = null;
  }
}

class GenericTree {
  constructor(root = null, asksAllowsChildren = true) {
    this.rootNode = root;
    this.asksAllowsChildren = asksAllowsChildren;
  }

  getRoot() {
    return this.rootNode;
  }

  getPathToRoot() {

  }

  getChild(parent, index) {

  }

  getNodeByKey(key, value) {

  }

  getIndexOfChild(parent, child) {

  }

  getIndexOfNode(node) {

  }

  setRoot(root) {
    this.rootNode = root;
  }

  insertNodeInto(newChild, parent, index) {

  }

  insertNextSibling(current, next) {
    if (!current.nextSibling) return current.nextSibling = next;
    return this.insertNextSibling(current.nextSibling, next);
  }

  insertNextChild(newChild, parent) {
    if (!parent.firstChild) return parent.firstChild = newChild;
    return this.insertNextSibling(parent.firstChild, newChild);
  }

  removeNodeFromParent(node) {

  }

  setAsksAllowsChildren(newValue) {

  }

  *traversePreorder(treeNode, level = 0) {
    function* t(node) {
      yield {
        node, level
      };
      if (node.firstChild) {
        yield * t(node.firstChild, level +1); 
      }
      if (node.nextSibling) {
        yield * t(node.nextSibling, level);
      }
    }

    for (let data of t(treeNode)) {
      yield data;
    }
  }

  *traversePostorder(treeNode, level = 0) {
    function* t(node) {
      if (node.firstChild) {
        yield * t(node.firstChild, level +1); 
      }
      if (node.nextSibling) {
        yield * t(node.nextSibling, level);
      }
      yield {
        node, level
      };
    }

    for (let data of t(treeNode)) {
      yield data;
    }
  }

  *traverseInorder(treeNode, level = 0) {
    function* t(node) {
      if (node.firstChild) {
        yield * t(node.firstChild, level +1); 
      }
      yield {
        node, level
      };
      if (node.nextSibling) {
        yield * t(node.nextSibling, level);
      }
    }

    for (let data of t(treeNode)) {
      yield data;
    }
  }

  asFlattenArray() {
    let result = [], nodeData;
    for (let { node, level } of this.traverseInorder(this.rootNode)) {
      nodeData = node?.data;
      if (!nodeData) continue;
      nodeData.level = level;
      result.push(nodeData)
    }
    return result;
  }

  asHierarhicalArray() {
    function x(node, target, level) {
      if (!node) return null;
      
      let nodeData = node.data; // copy
  
      nodeData.items = x(node.firstChild, [], level + 1);
  
      if (withLevels === true) {
        nodeData.level = level;
      }
        
      target.push(nodeData);
        
      if (node.nextSibling) {
        target = x(node.nextSibling, target, level);
      }
        
      return target;
    }
    
    return x(this.rootNode, [], 0);
  }
  
  static setFromAbstractTree(abstractTree) {
    const treeNodes = new Map();
    const rootNode = new TreeNode(
      abstractTree.root.data, 
      abstractTree.root.options
    );

    const resultTree = new GenericTree(rootNode);
    
    let newNode;
    for (const { data, options, isRoot } of abstractTree.traverseEntries()) {
      if (!isRoot) {
        newNode = new TreeNode(data, options);
        treeNodes.set(newNode.key, newNode);
      }
    }

    let parent;
    for (const node of treeNodes.values()) {
      parent = treeNodes.get(node.parentKey);
      if (!parent || !parent.allowChildren)
        resultTree.insertNextChild(node, rootNode);
      else
        resultTree.insertNextChild(node, parent);
    }

    return resultTree;
  }
}

export { GenericTree, AbstractGenericTree };