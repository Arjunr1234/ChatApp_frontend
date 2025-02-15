import { motion } from "framer-motion";

export default function ChatRequestNotification({ request, onAccept, onReject }) {
    if (!request) return null; 

    return (
        <motion.div 
            className="fixed top-5 right-5 z-50 bg-white shadow-lg border rounded-xl p-4 w-64"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
        >
            <p className="text-md font-semibold">{request.userName} sent a chat request</p>
            <div className="mt-3 flex justify-between">
                <button 
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                    onClick={() => onAccept(request.fromUserId, request.userName)}
                >
                    Accept
                </button>
                <button 
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                    onClick={() => onReject(request.fromUserId)}
                >
                    Reject
                </button>
            </div>
        </motion.div>
    );
}
