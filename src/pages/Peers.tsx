import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Button, Stack } from '@mui/material';

const Peers = () => {
    return (

        <div className='flex justify-between items-center'>
            <div>
                <h1>Peers</h1>
            </div>
            <div>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<DeleteIcon />}>
                        Delete
                    </Button>
                    <Button variant="contained" endIcon={<SendIcon />}>
                        Send
                    </Button>
                </Stack>
            </div>
        </div>

    );

};

export default Peers;
