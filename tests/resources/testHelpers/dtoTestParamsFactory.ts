/****
    This function creates arrays with the names of the decorators from nestjs class-validator
    Each array have the names of the paramPaths that will be used in the e2e tests.

    Examples will use the object bellow as reference.
    {
      client_id: "001",
      nestedObject: {
        code: "0123456789"
      }
    }
    ------Main subject of test Dto-------
    @IsString()    
    @MaxLength(3)
    client_id: string;    

    ------nestedObjectDto---------------
    @IsString()    
    @MaxLength(15)
    @IsNumberString() 
    code: string;
        
    --Setting the arrays with the decorator elements that we want to test above
    let dtoParams = {}
    dtoParams[''] = {"client_id": ["IsString", "MaxLength.3"]}
    dtoParams['nestedObject'] = {"code": ["IsString", "IsNumberString", "MaxLength.15"]}

    --Arrays that would be produced from the "function dtoValidation(dtoParams)"
    dtoValidationParams["IsString"] = ["client_id", "nestedObject.code"]
    dtoValidationParams["IsNumberString"] = ["nestedObject.code"]
    dtoValidationParams["MaxLength"] = [ ["client_id", "3"], ["nestedObject.code", "15"]]

    --Use in e2e test
    const testParams = dtoValidation(dtoParams)   

    test.each(testParams["IsString"])('should return **Bad Request** if param is not an string (%p)', async (p) => {
        set(requestData, p, 123)

        const { status, body: result } = await execPost()
        expect(status).toBe(400)
    });

*****/

export function makeDtoTestParams(dtoParams) {

  const dtoValidationParams: Array<any> = []

  Object.entries(dtoParams).forEach(([dto, obj]) => {
    Object.keys(obj).forEach((param) => {
      const classValidatorArray = obj[param]      
      const paramPath = (dto !== '') ? dto + "." + param : param
      let elementValue: any = paramPath

      classValidatorArray.forEach(element => {
        if (element.includes('.')) {
          const splitedElement = element.split(".")
          element = splitedElement[0]
          elementValue = [paramPath, splitedElement[1]] // ["MaxLength.3"] becomes ["MaxLength", "3"]
        }

        if (!dtoValidationParams[element]) dtoValidationParams[element] = [] //define the array if it doesnt exist to push
        dtoValidationParams[element].push(elementValue)
      })
    })
  })
  return dtoValidationParams
}