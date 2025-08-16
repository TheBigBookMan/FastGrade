interface OrgLogoProps {
    className?: string;
}

const OrgLogo = ({ className = "" }: OrgLogoProps) => {
    return (
        <div className={`flex items-center ${className}`}>
            <h1 className="text-2xl font-bold text-primary-600">
                FastGrade
            </h1>
        </div>
    );
};

export default OrgLogo;