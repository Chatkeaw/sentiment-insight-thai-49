import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FlowAgentModal from '@/components/FlowAgentModal';

const FlowAgentFeedbackPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Open modal when page loads
    setModalOpen(true);
  }, []);

  const handleModalClose = () => {
    setModalOpen(false);
    // Navigate back to previous page or complaints page
    navigate(-1);
  };

  return (
    <div>
      {/* The modal will overlay the current page */}
      <FlowAgentModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        feedbackId={id}
        initialData={location.state}
      />
    </div>
  );
};

export default FlowAgentFeedbackPage;