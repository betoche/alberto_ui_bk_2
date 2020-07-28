import { BaseModel } from '../base.model';

export class CouponModel extends BaseModel {
  public id: string;
  public code: string;
  public strategy_id: string;
  public benefits_provider_commerce_id: string;
  public exchanged_date: string;
  public benefits_provider_commerce_name: string;
  public strategy_name: string;

  constructor(params) {
    super();

    params = params || {};
    this.assignAttributesFromParams(params, [
      'id',
      'code',
      'strategy_id',
      'benefits_provider_commerce_id',
      'exchanged_date',
      'benefits_provider_commerce_name',
      'strategy_name'
    ]);
  }
}
