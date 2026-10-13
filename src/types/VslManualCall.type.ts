import { VslManualCallStatus } from '../utils/enums/VslManualCallStatus';
import { VslRunStatus } from '../utils/enums/VslRunStatus';
import { VslStopReason } from '../utils/enums/VslStopReason';

export type VslManualCallState = {
    status: VslManualCallStatus;
    runStatus: VslRunStatus | null;
    callWindowStartsAt: string | null;
    callWindowEndsAt: string | null;
    callMarkedDoneAt: string | null;
    stopReason: VslStopReason | null;
    canMarkCallDone: boolean;
};