import { NavLink } from "react-router-dom";

interface OrgLogoProps {
    className?: string;
}

const OrgLogo = ({ className = "" }: OrgLogoProps) => {
    const orgName = "FastGrade";
    return (
        <NavLink to="/" className={`flex items-center ${className}`}>
            <h1 className="text-2xl font-bold text-primary-600">
                FastGrade
            </h1>
        </NavLink>
    );
};

export default OrgLogo;