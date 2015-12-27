module connection_visualizer {
  export module NodeManager {
    var ids:number[];
    var names:string[];
    var forwardConnections:Array<number[]>;
    var lastId = null;

    export function numberOfNodes() {
      return ids.length;
    }

    /**
     * @return id of new Node
     * */
    export function createNode(name:string, newForwardConnections:number[] = []):number {
      lastId++;
      ids.push(lastId);
      names[lastId] = name;
      forwardConnections[lastId] = newForwardConnections;
      return lastId;
    }

    export function getNodeById(id:number) {
      return {
        id: function () {
          return id;
        },
        name: function () {
          return names[id];
        },
        forwardConnection: function () {
          return forwardConnections[id];
        }
      };
    }

    function save() {
      utils.localSave('ids', ids);
      utils.localSave('names', names);
      utils.localSave('forwardConnections', forwardConnections);
    }

    function load() {
      ids = utils.localLoad('ids', []);
      names = utils.localLoad('names', []);
      forwardConnections = utils.localLoad('forwardConnections', []);
      if (ids.length == 0)
        lastId = -1;
      else
        lastId = Math.max(...ids);
    }

    export function checkLoad() {
      if (lastId === null)
        load();
    }

    export function forEach(consumer) {
      var nextIndex = 0;
      ids.forEach(function (id) {
        consumer({
          id: function () {
            return id;
          },
          name: function () {
            return names[id];
          },
          forwardConnection: function () {
            return forwardConnections[id];
          }
        });
      });
    }

    export function map(producer) {
      var list = [];
      forEach(function (node) {
        list.push(producer(node));
      });
      return list;
    }

    export function toArray() {
      var list = [];
      forEach(function (node) {
        list.push(node);
      });
      return list;
    }

    export function toSimpleArray() {
      return map(function (node) {
        return {id: node.node(), name: node.name()}
      })
    }
  }
}

module utils {
  export function checkLocalStorageSupport() {
    if (typeof (Storage) == "undefined") {
      //var message = "Local Storage is not Supported";
      var message = "Error, your browser does not support web storage!";
      alert(message);
      throw new Error(message);
    }
  }

  export function localSave(key:string, value:any) {
    checkLocalStorageSupport();
    localStorage.setItem(key, JSON.stringify(value));
  }

  export function localLoad(key:string, defaultValue:any) {
    checkLocalStorageSupport();
    var value = localStorage.getItem(key);
    if (value === null)
      return defaultValue;
    else
      return value;
  }

  export function defined_structure(obj, attrs:any[]):boolean {
    return attrs.every(attr=>obj[attr] != undefined);
  }

  export function trimString(input:string):string {
    if (input == null)
      return "";
    else
      return input.trim();
  }
}
