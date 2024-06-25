import { IGetHistoryDTO } from '../interfaces/get-history-dto.interface';
import { ConversationIdDTO } from './conversation-id.dto';

export class GetHistoryPaginatedDTO
  extends ConversationIdDTO
  implements IGetHistoryDTO
{
  page: number = 0;
  limit: number = 10;
}
