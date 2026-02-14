import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ProjectContext = createContext();

export const useProject = () => useContext(ProjectContext);

const STEPS = [
    { path: '01-problem', label: 'Problem', id: 1 },
    { path: '02-market', label: 'Market', id: 2 },
    { path: '03-architecture', label: 'Architecture', id: 3 },
    { path: '04-hld', label: 'HLD', id: 4 },
    { path: '05-lld', label: 'LLD', id: 5 },
    { path: '06-build', label: 'Build', id: 6 },
    { path: '07-test', label: 'Test', id: 7 },
    { path: '08-ship', label: 'Ship', id: 8 },
];

export const ProjectProvider = ({ children }) => {
    const [artifacts, setArtifacts] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    // Load artifacts from localStorage on mount
    useEffect(() => {
        const loadedArtifacts = {};
        STEPS.forEach(step => {
            const key = `rb_step_${step.id}_artifact`;
            const value = localStorage.getItem(key);
            if (value) {
                loadedArtifacts[step.id] = value;
            }
        });
        setArtifacts(loadedArtifacts);
    }, []);

    const saveArtifact = (stepId, content) => {
        const key = `rb_step_${stepId}_artifact`;
        localStorage.setItem(key, content);
        setArtifacts(prev => ({ ...prev, [stepId]: content }));
    };

    const isStepComplete = (stepId) => {
        return !!artifacts[stepId];
    };

    const canAccessStep = (stepId) => {
        if (stepId === 1) return true;
        return isStepComplete(stepId - 1);
    };

    const currentStep = STEPS.find(s => location.pathname.includes(s.path));
    const currentStepId = currentStep?.id;

    // Gating Logic
    useEffect(() => {
        if (currentStepId && !canAccessStep(currentStepId)) {
            // Find the last completed step and redirect to next
            let lastCompleted = 0;
            for (let i = 1; i <= 8; i++) {
                if (isStepComplete(i)) lastCompleted = i;
                else break;
            }
            const targetStep = Math.min(lastCompleted + 1, currentStepId); // Don't jump ahead
            // Actually, simpler: redirect to the first incomplete step if trying to access future
            // But allowing access to completed steps + 1 is better.
            if (currentStepId > lastCompleted + 1) {
                const properStep = STEPS.find(s => s.id === lastCompleted + 1) || STEPS[0];
                navigate(`/rb/${properStep.path}`, { replace: true });
            }
        }
    }, [currentStepId, artifacts, navigate]);

    return (
        <ProjectContext.Provider value={{
            artifacts,
            saveArtifact,
            isStepComplete,
            STEPS,
            currentStep
        }}>
            {children}
        </ProjectContext.Provider>
    );
};
