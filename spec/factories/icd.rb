FactoryBot.define do
  factory :icd do
    id {1}
    code {"A00"}
    text_de { "Anything" }
    text_fr { "Anything" }
    text_it { "Anything" }
    annotationen { "" }
    kapitel {1}
    code_kapitel { "A00-B00" }
    kapitel_name_de { "Anything" }
    kapitel_name_fr { "Anything" }
    kapitel_name_it { "Anything" }
    kapitel_roemisch { "I" }
  end
end