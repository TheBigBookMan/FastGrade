import {Link} from 'react-router-dom';
import LoadingSpinner from "../../common/layout/LoadingSpinner.tsx";
import { Category } from "../../../types/categoryTypes.ts";
import { Comment } from "../../../types/commentTypes.ts";

interface TilesInterface {
    apiComments: Comment[];
    commentsLoad: boolean;
    apiCategories: Category[];
    categoriesLoad: boolean;
}

const Tiles = ({apiComments, commentsLoad, apiCategories, categoriesLoad}: TilesInterface) => {

    return (
        <div className="px-4 sm:px-0 flex justify-between items-center">
            <div className={'flex flex-col'}>
                <h2 className="text-2xl font-bold mb-4 text-secondary-900">Dashboard</h2>
                <p className="text-secondary-600">
                    Welcome to QuickNote! This is your dashboard.
                </p>
            </div>

            <div className="flex gap-4">
                <Link to={'/comments'} className="bg-white overflow-hidden shadow rounded-lg hover:bg-primary-50 transition px-5 py-3 flex items-center">
                    <dl className="flex items-center justify-between gap-4">
                        <dt className="text-sm font-medium text-secondary-500 truncate">
                            Comments
                        </dt>

                        {commentsLoad ? (
                            <dd className="text-2xl font-semibold text-secondary-900">
                                <LoadingSpinner />
                            </dd>
                        ) : (
                            <dd className="text-2xl font-semibold text-secondary-900">
                                {apiComments && apiComments.length}
                            </dd>
                        )}
                    </dl>
                </Link>

                <Link to={'/categories'} className="bg-white overflow-hidden shadow rounded-lg hover:bg-primary-50 transition px-5 py-3 flex items-center">
                    <dl className="flex items-center justify-between gap-4">
                        <dt className="text-sm font-medium text-secondary-500 truncate">
                            Categories
                        </dt>
                        {categoriesLoad ? (
                            <dd className="text-2xl font-semibold text-secondary-900">
                                <LoadingSpinner />
                            </dd>
                        ) : (
                            <dd className="text-2xl font-semibold text-secondary-900">
                                {apiCategories && apiCategories.length}
                            </dd>
                        )}
                    </dl>
                </Link>

                <Link to={'/attachments'} className="bg-white overflow-hidden shadow rounded-lg hover:bg-primary-50 transition px-5 py-3 flex items-center">
                    <dl className="flex items-center justify-between gap-4">
                        <dt className="text-sm font-medium text-secondary-500 truncate">
                            Attachments
                        </dt>
                        <dd className="text-2xl font-semibold text-secondary-900">0</dd>
                    </dl>
                </Link>
            </div>
        </div>
    )
}

export default Tiles;