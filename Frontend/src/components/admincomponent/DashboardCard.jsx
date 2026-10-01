// components/admincomponent/DashboardCard.jsx (Example)
const DashboardCard = ({ title, value, icon, color, onClick, subtitle }) => {
    const clickableClass = onClick ? 'cursor-pointer hover:shadow-lg transform hover:-translate-y-0.5 transition' : '';
    return (
        <div onClick={onClick} role={onClick ? 'button' : undefined} className={`p-6 rounded-lg shadow-md ${color} ${clickableClass}`}>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-medium">{title}</p>
                    {subtitle && <p className="text-sm text-gray-700 mt-1">{subtitle}</p>}
                    <p className="text-3xl font-bold mt-1">{value}</p>
                </div>
                <span className="text-3xl">{icon}</span>
            </div>
        </div>
    );
};
export default DashboardCard;