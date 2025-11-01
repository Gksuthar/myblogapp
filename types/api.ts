
export type IdString = string;

export interface HeroSection {
image?: string;
title: string;
description: string;
}

export interface Card {
id: IdString;
title: string;
description: string;
}

export interface CardSection {
id: IdString;
sectionTitle: string;
sectionDescription?: string;
cards: Card[];
}

export interface Service {
id: IdString;
categoryId: IdString;
heroSection: HeroSection;
cardSections: CardSection[];
content?: string;
createdAt?: string;
updatedAt?: string;
}

export interface Category {
id: IdString;
name: string;
description: string;
createdAt?: string;
updatedAt?: string;
services?: Service[];
}

export interface ApiList<T> {
data: T[];
}

export interface ApiItem<T> {
data: T;
message?: string;
}