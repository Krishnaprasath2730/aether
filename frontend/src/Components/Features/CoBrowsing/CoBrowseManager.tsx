import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Snackbar, Alert, Chip } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCoBrowse } from './CoBrowseContext';
import PrivacyOverlay from './PrivacyOverlay';
import LinkIcon from '@mui/icons-material/Link';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

const CoBrowseManager: React.FC = () => {
    const { role, sessionId, status, createSession, joinSession, endSession, broadcast, lastEvent } = useCoBrowse();
    const location = useLocation();
    const navigate = useNavigate();
    const [isPrivate, setIsPrivate] = useState(false);
    const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
    const [endDialogOpen, setEndDialogOpen] = useState(false);
    const [showCopySuccess, setShowCopySuccess] = useState(false);
    const [joinInputId, setJoinInputId] = useState('');
    const [remoteCursor, setRemoteCursor] = useState<{ x: number, y: number } | null>(null);

    // ... (keep existing code up to handleJoin) ...

    // Privacy Logic: Check URL
    useEffect(() => {
        const privatePaths = ['/checkout', '/account', '/profile'];
        const currentIsPrivate = privatePaths.some(path => location.pathname.includes(path));

        setIsPrivate(currentIsPrivate);

        // Notify guests if privacy state changes
        if (role === 'host') {
            broadcast('PRIVACY_TOGGLE', { isPrivate: currentIsPrivate });
        }
    }, [location, role, broadcast]);

    // Helper to generate CSS selector
    const getCssSelector = (el: Element): string => {
        if (el.id) return `#${el.id}`;
        if (el.tagName.toLowerCase() === 'body') return 'body';
        if (el.tagName.toLowerCase() === 'html') return 'html';

        // Optimization: if direct parent has ID, use that
        if (el.parentElement && el.parentElement.id) {
            let tag = el.tagName.toLowerCase();
            let siblings = Array.from(el.parentElement.children);
            let index = siblings.indexOf(el) + 1;
            return `#${el.parentElement.id} > ${tag}:nth-child(${index})`;
        }

        let path = [];
        while (el.parentElement) {
            let tag = el.tagName.toLowerCase();
            let siblings = Array.from(el.parentElement.children);
            let index = siblings.indexOf(el) + 1;
            path.unshift(`${tag}:nth-child(${index})`);
            el = el.parentElement;
        }
        return path.join(' > ');
    };



    // Inbound Events (Listen)
    useEffect(() => {
        if (!lastEvent) return;

        if (lastEvent.type === 'NAVIGATE') {
            if (location.pathname !== lastEvent.payload.path) {
                isSilentUpdate.current = true;
                navigate(lastEvent.payload.path);
                setTimeout(() => { isSilentUpdate.current = false; }, 100);
            }
        }

        if (lastEvent.type === 'CLICK') {
            console.log("Remote Click Received:", lastEvent.payload);
            isSilentUpdate.current = true;
            try {
                const element = document.querySelector(lastEvent.payload.selector) as HTMLElement;
                if (element) {
                    const ripple = document.createElement('div');
                    Object.assign(ripple.style, {
                        position: 'absolute',
                        left: `${lastEvent.payload.x}px`,
                        top: `${lastEvent.payload.y}px`,
                        width: '20px',
                        height: '20px',
                        background: 'rgba(255, 0, 0, 0.5)',
                        borderRadius: '50%',
                        zIndex: '9999',
                        pointerEvents: 'none',
                        transform: 'translate(-50%, -50%)'
                    });
                    document.body.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 500);

                    element.click();
                    element.focus();
                }
            } catch (e) {
                console.error("Click error:", e);
            }
            setTimeout(() => { isSilentUpdate.current = false; }, 300);
        }

        if (lastEvent.type === 'INPUT') {
            isSilentUpdate.current = true;
            const element = document.querySelector(lastEvent.payload.selector) as HTMLInputElement;
            if (element) {
                element.value = lastEvent.payload.value;
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
            }
            setTimeout(() => { isSilentUpdate.current = false; }, 50);
        }

        if (lastEvent.type === 'PRIVACY_TOGGLE') {
            if (role === 'guest') setIsPrivate(lastEvent.payload.isPrivate);
        }

        if (lastEvent.type === 'SCROLL') {
            isSilentUpdate.current = true;
            window.scrollTo({
                top: lastEvent.payload.y,
                behavior: 'auto'
            });
            setTimeout(() => { isSilentUpdate.current = false; }, 50);
        }

        if (lastEvent.type === 'CURSOR_MOVE') {
            setRemoteCursor({ x: lastEvent.payload.x, y: lastEvent.payload.y });
        }

        if (lastEvent.type === 'PEER_DISCONNECTED') {
            setRemoteCursor(null);
            // Optional: Show a message that partner left?
            // alert("Partner disconnected");
        }

        // Trigger hearts on join
        if (lastEvent.type === 'SESSION_JOINED' || lastEvent.type === 'GUEST_JOINED') {
            // spawnHearts();
        }

    }, [lastEvent, role, navigate, location.pathname]);

    // Outbound Events (Broadcast)
    useEffect(() => {
        if (!sessionId) return;

        // Navigation Broadcast
        const privatePaths = ['/checkout', '/account', '/profile'];
        const isTargetPrivate = privatePaths.some(path => location.pathname.includes(path));

        if (!isSilentUpdate.current) {
            if (role === 'guest' && isTargetPrivate) {
                // Block Guest -> Host private nav
            } else {
                broadcast('NAVIGATE', { path: location.pathname });
            }
        }

        const handleInput = (e: Event) => {
            if (isSilentUpdate.current) return;
            if (role === 'guest' && isTargetPrivate) return;

            const target = e.target as HTMLInputElement;
            if (target.type === 'password') return;

            const selector = getCssSelector(target);
            broadcast('INPUT', {
                selector,
                value: target.value
            });
        };

        const handleClick = (e: MouseEvent) => {
            if (isSilentUpdate.current) return;
            if (role === 'guest' && isTargetPrivate) return;

            let target = e.target as Element;
            const interactive = target.closest('button, a, input, select, [role="button"]');
            if (interactive) target = interactive;

            if (target.closest && (target.closest('.MuiDialog-root') || target.closest('.MuiChip-root'))) return;

            const selector = getCssSelector(target);
            console.log("Broadcasting Click:", selector);

            broadcast('CLICK', {
                selector,
                x: e.pageX,
                y: e.pageY
            });
        };

        const handleScroll = () => {
            if (timeout || isSilentUpdate.current) return;
            timeout = setTimeout(() => {
                broadcast('SCROLL', { y: window.scrollY });
                timeout = null!;
            }, 50);
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (cursorTimeout) return;
            cursorTimeout = setTimeout(() => {
                broadcast('CURSOR_MOVE', { x: e.pageX, y: e.pageY });
                cursorTimeout = null!;
            }, 30);
        };

        let timeout: ReturnType<typeof setTimeout>;
        let cursorTimeout: ReturnType<typeof setTimeout>;

        window.addEventListener('click', handleClick, true);
        window.addEventListener('input', handleInput, true);
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('click', handleClick, true);
            window.removeEventListener('input', handleInput, true);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            if (timeout) clearTimeout(timeout);
            if (cursorTimeout) clearTimeout(cursorTimeout);
        };
    }, [location, role, sessionId, broadcast]);

    const handleJoin = () => {
        if (joinInputId.trim()) {
            joinSession(joinInputId.trim());
            setIsJoinDialogOpen(false);
        }
    };



    const handleEndSession = () => {
        endSession();
        setRemoteCursor(null);
        setEndDialogOpen(false);
    };

    // Loop prevention flag
    const isSilentUpdate = React.useRef(false);

    // Couples Theme Colors
    const themeColor = '#E91E63'; // Pink/Rose

    return (
        <>
            {/* Privacy Overlay for Guests */}
            <PrivacyOverlay isVisible={role === 'guest' && isPrivate} />

            {/* Remote Cursor */}
            {remoteCursor && !isPrivate && (
                <Box
                    sx={{
                        position: 'absolute',
                        left: remoteCursor.x,
                        top: remoteCursor.y,
                        width: 12,
                        height: 12,
                        bgcolor: role === 'host' ? '#FF5722' : '#6C5DD3', // Diff colors for diff roles
                        borderRadius: '50%',
                        pointerEvents: 'none',
                        zIndex: 9999,
                        transform: 'translate(-50%, -50%)',
                        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
                        transition: 'top 0.1s linear, left 0.1s linear'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 14,
                            left: 14,
                            bgcolor: '#2C2C2C',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {role === 'host' ? 'Guest' : 'Host'}
                    </Box>
                </Box>
            )}

            {/* Floating Control Panel */}
            <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1300, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'end' }}>
                <Chip
                    label={`Status: ${status}`}
                    size="small"
                    color={status === 'connected' ? 'success' : status === 'connecting' ? 'warning' : 'default'}
                    sx={{ bgcolor: 'white', fontWeight: 600 }}
                />

                {sessionId ? (
                    <Chip
                        icon={<SupervisorAccountIcon />}
                        label={`${role === 'host' ? 'Hosting' : 'Guest'} Session: ${sessionId}`}
                        color="primary"
                        onDelete={() => { navigator.clipboard.writeText(sessionId); alert('Session ID copied!'); }}
                    />
                ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            startIcon={<SupervisorAccountIcon />}
                            disabled={status === 'connecting'}
                            onClick={createSession}
                            sx={{ borderRadius: 20, bgcolor: '#2C2C2C' }}
                        >
                            Start Host
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<LinkIcon />}
                            disabled={status === 'connecting'}
                            onClick={() => setIsJoinDialogOpen(true)}
                            sx={{ borderRadius: 20, bgcolor: 'white', color: '#2C2C2C', borderColor: '#2C2C2C' }}
                        >
                            Join
                        </Button>
                    </Box>
                )}
            </Box>

            {/* Copy Success Snackbar */}
            <Snackbar
                open={showCopySuccess}
                autoHideDuration={4000}
                onClose={() => setShowCopySuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setShowCopySuccess(false)}
                    icon={<span style={{ fontSize: '1.2rem' }}>💌</span>}
                    sx={{
                        width: '100%',
                        bgcolor: 'white',
                        color: '#333',
                        fontWeight: 600,
                        border: '1px solid rgba(233,30,99,0.2)',
                        boxShadow: '0 8px 24px rgba(233,30,99,0.15)',
                        '& .MuiAlert-icon': { mr: 1.5 }
                    }}
                >
                    <Box component="span" sx={{ color: themeColor }}>Code Copied!</Box> Share it with your partner ❤️
                </Alert>
            </Snackbar>

            <Dialog open={endDialogOpen} onClose={() => setEndDialogOpen(false)} PaperProps={{ sx: { borderRadius: 4, textAlign: 'center', p: 1 } }}>
                <DialogTitle sx={{ fontSize: '2rem' }}>😩</DialogTitle>
                <DialogContent>
                    <Box sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 1 }}>Ending Date Night?</Box>
                    <Box sx={{ color: '#666' }}>Are you sure you want to stop shopping together?</Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button onClick={() => setEndDialogOpen(false)} sx={{ color: '#666' }}>No, stay</Button>
                    <Button onClick={handleEndSession} variant="contained" color="error" sx={{ borderRadius: 10 }}>End Session</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isJoinDialogOpen} onClose={() => setIsJoinDialogOpen(false)} PaperProps={{ sx: { borderRadius: 4, boxShadow: '0 20px 60px rgba(0,0,0,0.1)', maxWidth: 400 } }}>
                <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
                    <Box sx={{ color: themeColor, fontSize: '2rem', mb: 1 }}>❤️</Box>
                    <Box sx={{ fontWeight: 700, fontFamily: '"Playfair Display", serif' }}>Join Your Partner</Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ textAlign: 'center', color: '#666', mb: 3 }}>Enter the secret code shared by your partner to start shopping together.</Box>
                    <TextField autoFocus fullWidth variant="outlined" value={joinInputId} onChange={(e) => setJoinInputId(e.target.value)} placeholder="Paste Date Night Code..."
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, '&.Mui-focused fieldset': { borderColor: themeColor } } }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
                    <Button onClick={() => setIsJoinDialogOpen(false)} sx={{ color: '#666' }}>Cancel</Button>
                    <Button onClick={handleJoin} variant="contained" disabled={!joinInputId} sx={{ bgcolor: themeColor, borderRadius: 10, px: 4, '&:hover': { bgcolor: '#D81B60' } }}>Connect ❤️</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CoBrowseManager;
