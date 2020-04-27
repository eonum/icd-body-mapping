class Api::V1::IcdsController < ApplicationController

  # GET /icds
  # GET /icds.json
  def index
    render json: Icd.all.order(code: :asc)
  end

  # GET /icds/1
  # GET /icds/1.json
  def show
    icd = Icd.find(params[:id])
    render json: icd
  end

  # POST /icds
  # POST /icds.json
  def create
    icd = Icd.create(icd_params)
    render json: icd
  end

  # PATCH/PUT /icds/1
  # PATCH/PUT /icds/1.json
  def update
    icd = Icd.find(params[:id])
    icd.update_attributes(icd_params)
    render json: icd
  end

  # DELETE /icds/1
  # DELETE /icds/1.json
  def destroy
    Icd.destroy(params[:id])
  end

  private
    # Only allow a list of trusted parameters through.
    def icd_params
      params.require(:icd).permit(:code, :version, :text_de, :text_fr, :text_it, :annotationen, :kapitel)
    end
end
