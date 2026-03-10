export interface BrandColor {
    readonly id: number;
    readonly colorName: string;
    readonly hexCode: string;
}

export interface Brand {
    readonly id: number;
    readonly name: string;
    readonly logoUrl: string | null;
    readonly description: string;
    readonly isActive: boolean;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly deletedAt: string | null;
    readonly colors: BrandColor[];
}