class ChapterController < ApplicationController


  before_action only: :show

  def index
    icd = Icd.select('distinct(kapitel)').order(kapitel: :asc)
    render json: icd
  end

  def show
    icd = Icd.select('id, kapitel').where("kapitel = ?", params[:kapitel])
    render :json => icd
  end

  private

end