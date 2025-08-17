import Header from "../components/common/layout/header/Header";
import FeedbackForm from "../components/features/feedback/FeedbackForm";

const FeedbackPage = () => {
    return (
        <div className="min-h-screen bg-secondary-50">
            <Header />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <FeedbackForm />
            </main>
        </div>
    )
}

export default FeedbackPage;