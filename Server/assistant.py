import json
from joblib import load
import numpy as np
__locs = None
__areas = None
__columns = None
__model = None

__loaded = False

def get_location_data ():
    pass




def make_prediction (params):

    if (len(params)) != 7:
        print('not enough paramters found')
        return -1

    lst = np.zeros(len(__columns))
    try:

        mainset = params[:5]
        # print('mainset', mainset, '\n')
        area = params[5]
        # print('area', area, '\n')
        location = params[6]
        # print('location', location, '\n')

        areaIndex = __columns.index(area)
        # print('location', location, '\n')
        locIndex = __columns.index(location)

        for k in range (len(mainset)):
            lst[k] = mainset[k]

        lst[areaIndex] = 1
        lst[locIndex] = 1

        predictions = __model.predict([lst])
        print(round(predictions[0], 2))
        return round(predictions[0], 2)

    except (ValueError):
        print('got val error')
        return -1


def return_meta_information ():

    load_saved_artifacts ()
	
    first_set = __columns[:5]
    second_set = ['area', 'location']	
    relevant_columns = first_set + second_set

    output = {
        'columns': relevant_columns,
        'areas':__areas,
        'locations':__locs
    }

    return output


# availability, size, total_sqft, bath, balcony, area, location




    # return predictions[0]

def load_saved_artifacts ():

    global __loaded

    if __loaded:
        return


    global __locs
    global __columns
    global __model
    global __areas

    with open('./data/columns.json', 'r') as f:
        __columns = json.load(f)['columns']
        __areas = __columns[5:8]
        __locs = __columns[8:14]

    __model = load('./models/random_forest_model.joblib')

    __loaded = True

    # print('columns', __columns, '\n')
    # print('locations', __locs, '\n')
    # print('areas', __areas)

def print_variables ():
    global __locs
    global __areas
    global __columns
    global __model

# load_saved_artifacts()

if __name__ == '__main__':
    print('loading artifacts')
    load_saved_artifacts()

    # make_prediction([
    #     1513641600,
    #     2,
    #     1056,
    #     2,
    #     1,
    #     'area_type_Plot',
    #     'location_other',        
    # ])

    # make_prediction([
    #     2513641600,
    #     2,
    #     1056,
    #     2,
    #     1,
    #     'area_type_Plot',
    #     'location_Yelahanka',        
    # ])

