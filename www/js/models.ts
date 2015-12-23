module connection_visualizer {
  export class Node {
    id:number;
    name:number;
    peer_list:Node[];

    constructor(id:number, name:string, peer_list:Node[] = []) {
      this.id = id;
      this.name = id;
      this.peer_list = peer_list;
    }

    public isPeer(node:Node):boolean {
      return this.peer_list.indexOf(node) != -1;
    }

    /**
     * @param node Node : new peer to add
     * @return boolean : true if the new node is added successfully
     *                   false if the new node is already peer
     * */
    public addPeer(node:Node):boolean {
      if (this.isPeer(node))
        return false;
      this.peer_list.push(node);
      return true;
    }

    /**
     * @param node Node : the node to be removed
     * @return boolean : true if removed successfully
     *                   false if the node is not peer previously
     * */
    public removePeer(node:Node):boolean {
      var index = this.peer_list.indexOf(node);
      if (index == -1)
        return false;
      this.peer_list.slice(index, 1);
      return true;
    }

    public toString():string {
      return JSON.stringify(this);
    }
  }

  /**
   * @param rawString string : the serialized string of the node object
   * @return Node : the Node object
   *         false : if failed to parse the object
   * */
  export function parseNode(rawString:string):Node|boolean {
    var object = JSON.parse(rawString);
    if (!utils.defined_structure(object, ['id', 'name', 'peer_list']))
      return false;
    return new Node(object.id, object.name, object.peer_list);
  }

  export class Connection {
    constructor(public active:Node, public passive:Node) {
    }
  }
}
module utils {
  export function defined_structure(obj, attrs:any[]):boolean {
    return attrs.every(attr=>obj[attr] != undefined);
  }
}
