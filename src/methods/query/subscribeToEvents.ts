import { processChainEvent } from '../../utils/apiUtils';
import Api from '../../api';

export async function subscribeToEvents(
  eventCallback: ({
    id,
    index,
    progress,
  }: {
    id: string;
    index?: number;
    progress: number;
  }) => void
) {
  const api = Api.getApi();

  api.query.system.events((events: any) => {
    processChainEvent({ events }, eventCallback);
  });
}
