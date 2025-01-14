import mitt, { Emitter } from "mitt";

type Events = {
  toggleMenu: void;
  customEvent: string;
};

export const eventBus: Emitter<Events> = mitt<Events>();
