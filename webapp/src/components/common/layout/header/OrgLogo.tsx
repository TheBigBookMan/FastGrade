import { NavLink } from "react-router-dom";

interface OrgLogoProps {
    className?: string;
}

const OrgLogo = ({ className = "" }: OrgLogoProps) => {
    const orgName = "QuickNote";
    return (
        <NavLink to="/" className={`flex items-center ${className}`}>
            <h1 className="text-2xl font-bold text-primary-600">
                QuickNote
            </h1>
        </NavLink>
    );
};

export default OrgLogo;