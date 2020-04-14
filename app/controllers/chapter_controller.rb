class ChapterController < ApplicationController
  before_action only: :show

  def index
    icd = Icd.select('distinct(kapitel),
                      first_value(id) over (partition by kapitel order by code Asc) as id,
                      first_value(code) over (partition by kapitel order by code asc) as code,
                      first_value(annotationen) over (partition by kapitel order by code asc) as annotationen,
                      first_value(text_de) over (partition by kapitel order by code asc) as text_de,
                      first_value(text_fr) over (partition by kapitel order by code asc) as text_fr,
                      first_value(text_it) over (partition by kapitel order by code asc) as text_it,
                      first_value(version) over (partition by kapitel order by code asc) as version').order(kapitel: :asc)
    render json: icd
  end

  def show
    icd = Icd.select('id, kapitel').where("kapitel = ?", params[:kapitel])
    render :json => icd
  end

  private

end