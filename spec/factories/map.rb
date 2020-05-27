FactoryBot.define do
  factory :map do
    icd_id {1}
    sequence(:layer_id)
  end
end