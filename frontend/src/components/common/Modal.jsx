import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const Modal = ({ isOpen, onClose, title, children }) => {
  const { isDark } = useTheme();

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          color: isDark ? '#ffffff' : '#0f172a',
          borderRadius: '12px'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="font-semibold">{title}</span>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <X className="w-5 h-5" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: isDark ? '#334155' : '#e2e8f0', p: 3 }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
