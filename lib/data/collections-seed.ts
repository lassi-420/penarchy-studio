import type { Collection } from "@/lib/types";

export const collectionsSeed: Collection[] = [
  { id: "col_damascus", name: "The Damascus Collection", slug: "the-damascus-collection", visible: true, description: "Objects forged from layered Damascus steel." },
  { id: "col_writers", name: "The Writer's Collection", slug: "the-writers-collection", visible: true, description: "Pens built for daily use and passed down." },
  { id: "col_limited", name: "Limited Editions", slug: "limited-editions", visible: true, description: "Small-batch releases that will not be reproduced." },
  { id: "col_metal_form", name: "Metal & Form", slug: "metal-and-form", visible: true, description: "Sculptural metalwork across steel, brass and copper." },
  { id: "col_bracelet", name: "Bracelet Collection", slug: "bracelet-collection", visible: true, description: "Cuffs and bangles across every material in the studio." },
];
