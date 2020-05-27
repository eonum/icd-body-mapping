FactoryBot.define do
  before(:create) do
    let!(:icd) { FactoryBot.create(:icd) }
    let!(:layer) { FactoryBot.create(:layer) }
  end
  factory :map do
    icd_id {icd.id}
    layer_id {layer.id}
  end
end