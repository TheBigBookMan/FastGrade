import Header from '../components/common/layout/header/Header';
import {useAuth} from "../contexts/AuthContext.tsx";
import Tiles from "../components/features/dashboard/Tiles.tsx";
import FavouriteComments from "../components/features/dashboard/FavouriteComments.tsx";
import MostUsedComments from "../components/features/dashboard/MostUsedComments.tsx";
import {useCategories} from "../hooks/useCategory.ts";
import {useComments} from "../hooks/useComment.ts";

const DashboardPage = () => {
    const {user} = useAuth();
    if(!user) return;

    const {data: apiCategories = [], isLoading: categoriesLoad, error: categoriesError} = useCategories(user.id);
    const {data: apiComments = [], isLoading: commentsLoad, error: commentsError} = useComments(user.id, false);

    return (
        <div className="min-h-screen bg-secondary-50">
            <Header />
            
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Tiles apiCategories={apiCategories} categoriesLoad={categoriesLoad} apiComments={apiComments} commentsLoad={commentsLoad} />

                <FavouriteComments apiComments={apiComments} apiCategories={apiCategories} />
                
                <MostUsedComments apiComments={apiComments} apiCategories={apiCategories} />
            </main>
        </div>
    );
};

export default DashboardPage;