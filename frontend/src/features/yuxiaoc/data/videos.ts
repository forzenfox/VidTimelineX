import type { Video, CanteenCategory } from "./types";

import videosData from "./videos.json";
import canteenCategoriesData from "./canteenCategories.json";

export const videos: Video[] = videosData;

export const canteenCategories: CanteenCategory[] = canteenCategoriesData;

export { videos as default };
