global.chrome = {
  tabs: {
    query: async () => {
      throw new Error("Unimplemented.");
    },
    sendMessage: async () => {
      throw new Error("Unimplemented");
    },
  },
  tabGroups: {
    query: async () => {
      throw new Error("Unimplemented");
    },
  },
  extension: {
    getViews: async () => {
      throw new Error("Unimplemented");
    },
  },
  storage: {
    local: {
      set: async () => {
        throw new Error("Unimplemented");
      },
      remove: async () => {
        throw new Error("Unimplemented");
      },
      get: async () => {
        throw new Error("Unimplemented");
      },
    },
  },
};
