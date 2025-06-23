import { defineStore } from "pinia";

export const siteSetup = defineStore("site", () => {
  const name = 'My Site';


  return { name };
});
