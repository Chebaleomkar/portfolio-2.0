import { Bio } from "@/utils/data";
export const Footer = () => {
    return (
        <footer className=" dark:bg-gray-800 rounded-md py-8">
            <div className="container mx-auto px-4 text-center">
                <p className="text-muted-foreground">
                    © {new Date().getFullYear()} {Bio.name}. All rights reserved.
                </p>
            </div>
        </footer>
    );
};
