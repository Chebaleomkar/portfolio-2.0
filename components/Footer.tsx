import { Bio } from "@/utils/constants";
export const Footer = () => {
    return (
        <footer className="bg-card py-8">
            <div className="container mx-auto px-4 text-center">
                <p className="text-muted-foreground">
                    © {new Date().getFullYear()} {Bio.name}. All rights reserved.
                </p>
            </div>
        </footer>
    );
};
